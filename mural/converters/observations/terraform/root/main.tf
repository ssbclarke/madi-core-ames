## Get the variables from the workspace yaml file and add them to the scope of the main.tf
locals {
    # Fetches the environment/workspace
    workspace_path = "../config/${terraform.workspace}.yaml"
    defaults       = file("../config/${path.module}/default.yaml")
    workspace = fileexists(local.workspace_path) ? file(local.workspace_path) : yamlencode({})
    settings = merge(
        yamldecode(local.defaults),
        yamldecode(local.workspace)
    )
}
output "config" {
    value = local.settings
}
output "network" {
  value = data.google_compute_network.network
}

# Create the project with the GCP project factory
module "main_project" {
  source  = "terraform-google-modules/project-factory/google"
  version = "9.2.0"

  org_id          = local.settings.org_id
  billing_account = local.settings.billing_account

  name              = "${local.settings.env}-${local.settings.project_id_base}"
  folder_id         = local.settings.parent_folder_id

  // Set this to false if you do NOT want to append numbers to the project
  random_project_id = "true"

  shared_vpc = local.settings.network_project_id

  shared_vpc_subnets = [
    "projects/${data.google_compute_network.network.project}/regions/us-central1/subnetworks/apps-tertiary",
    "projects/${data.google_compute_network.network.project}/regions/us-east4/subnetworks/apps-primary",
    "projects/${data.google_compute_network.network.project}/regions/us-east4/subnetworks/infra-primary",
    "projects/${data.google_compute_network.network.project}/regions/us-west1/subnetworks/apps-secondary",
  ]

  activate_apis = [
    # "compute.googleapis.com",
    # "serviceusage.googleapis.com",
    # "cloudresourcemanager.googleapis.com",
    # "redis.googleapis.com",
    # "sqladmin.googleapis.com",
    # "servicenetworking.googleapis.com",
    # "appengine.googleapis.com",
    # "appengineflex.googleapis.com",
    # "run.googleapis.com",
    # "artifactregistry.googleapis.com",
    "cloudfunctions.googleapis.com",
    # "bigquery.googleapis.com",
    # "sql-component.googleapis.com", // cloud run sql access
    # "vpcaccess.googleapis.com",
    # "cloudasset.googleapis.com", // DataDog integration
    # "pubsub.googleapis.com"
  ]
}

output "main_project_number" {
  value = module.main_project.project_number
}

output "main_project_id" {
  value = module.main_project.project_id
}


## Adds lien to project so it cannot be deleted
resource "google_resource_manager_lien" "lien" {
  parent       = "projects/${module.main_project.project_number}"
  restrictions = ["resourcemanager.projects.delete"]
  origin       = "machine-readable-explanation"
  reason       = "Projects cannot be deleted without express permission from Tech Mgmt"
}


# Service Account for Terraform Automation inside the future project
#--------------------------------------------------------------------
resource "google_service_account" "main_project_tf_automation" {
  project      = module.main_project.project_id
  account_id   = "terraform-automation"
  display_name = "Terraform Automation (Managed by org-admin Terraform)"
}

# Roles that the service account will use
variable main_project_tf_automation_sa_roles {
  type = set(string)
  default = [
    "roles/compute.admin",
    "roles/iam.serviceAccountUser",
    "roles/redis.admin",
    "roles/resourcemanager.projectIamAdmin",
    "roles/storage.admin",
    "roles/cloudsql.admin",
    "roles/servicenetworking.networksAdmin",
    "roles/run.admin",
    "roles/owner",
  ]
}

# creates and adds roles to the terraform SA
resource "google_project_iam_member" "main_project_tf_sa" {
  for_each = var.main_project_tf_automation_sa_roles
  project  = module.main_project.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.main_project_tf_automation.email}"
}

# Binds specific users to have access to the Terrafrom Automation SA
resource "google_service_account_iam_binding" "main_project_tf_sa_key_admin" {
  service_account_id = google_service_account.main_project_tf_automation.name
  role               = "roles/iam.serviceAccountKeyAdmin"
  members = [
    "user:chanuka@techolution.com",
    "user:jvillarrubia@cipherhealth.com"
  ]
}

##### EXTERNAL PERMISSIONS FOR THE PROJECT
#-------------------------------------------------------------------
# Log Bucket Permission for Terraform SA
resource "google_storage_bucket_iam_member" "log_bucket_member" {
  bucket = "${local.settings.long_term_storage_bucket_prefix}-log_backups-ch"
  role   = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.main_project_tf_automation.email}"
}
# Network Get Permission for Terraform SA
resource "google_project_iam_member" "network_project_read" {
  project  = data.google_compute_network.network.project
  role     = "roles/compute.networkViewer"
  member   = "serviceAccount:${google_service_account.main_project_tf_automation.email}"
}
