# Enable Cloud Functions API
resource "google_project_service" "cf" {
  project = data.google_project.project.project_id
  service = "cloudfunctions.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}

locals {

}

# Compress source code for bigquery dump to bucket
data "archive_file" "source" {
  type        = "zip"
  source_dir  = "./bigquery_dump_function" # Directory where the Python source code is
  output_path = "./output/bigquery_dump_function.zip"
}

resource "google_storage_bucket_object" "source_zip" {
  name   = "${data.archive_file.source.output_md5}.zip"
  bucket = google_storage_bucket.data_reporting_bucket.name
  source = "./output/bigquery_dump_function.zip"
}

resource "google_cloudfunctions_function" "bigquery_dump_function" {
  project     = data.google_project.project.project_id
  region      = local.settings.primary_region
  name        = "bigquery_dump_v1"
  description = "cloud function that is triggered by a cloud schedule to copy bigquery table to bucket"
  runtime     = "python37"

  environment_variables = {
    PROJECT_ID = data.google_project.project.project_id
  }

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.data_reporting_bucket.name
  source_archive_object = google_storage_bucket_object.source_zip.name
  entry_point           = "hello_pubsub"
  event_trigger {
      event_type= "google.pubsub.topic.publish"
      resource= google_pubsub_topic.bigquery_dump_topic.name
   }
}

# Create IAM entry so all users can invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.bigquery_dump_function.project
  region         = google_cloudfunctions_function.bigquery_dump_function.region
  cloud_function = google_cloudfunctions_function.bigquery_dump_function.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
