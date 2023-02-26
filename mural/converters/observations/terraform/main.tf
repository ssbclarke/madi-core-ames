# Project Resources for the Sample FeathersJS application
# --------------------------------------------------------------

## Get the variables from the workspace yaml file and add them to the scope of the main.tf
locals {
  workspace_path = "./config/${terraform.workspace}.yaml"
  defaults       = file("./config/default.yaml")
  workspace = fileexists(local.workspace_path) ? file(local.workspace_path) : yamlencode({})
  only_in_production_mapping = {
    sandbox     = 0
    develop     = 0
    qaload      = 0
    staging     = 0
    production  = 1
  }
  settings = merge(
    yamldecode(local.defaults),
    yamldecode(local.workspace),
    {
      # Use this variable as count = local.settings.only_in_production to add features to prod only
      only_in_production = local.only_in_production_mapping[terraform.workspace]
    }
  )
}

# output "config" {
#   value = local.settings
# }

# ## This creates a separate non-root user for the cloudrun instances to connect to the cloudsql instances
# resource "google_sql_user" "db_user" {
#   project  = data.google_project.project.project_id
#   count    = 1
#   name     = "cloudrun_user"
#   instance = google_sql_database_instance.postgres.name
#   password = "changeme"
# }

# output "run_json" {
#   value = jsonencode(data.google_cloud_run_service.run_latest)
# }

## Outputs info about the configurations
# resource "local_file" "application_config" {
#   content  = <<EOT
#   {
#     "cloudsql": "${google_sql_database_instance.postgres.connection_name}",
#     "cloudrun": "${google_cloud_run_service.run_service.status[0].url}",
#     "container_reg": "${google_artifact_registry_repository.app_reg.name}"
#   }
#   EOT
#   filename = "${path.module}/output/cloudrun-${local.settings.env}.json"
# }
