# Google Play Submit Notes

This project did not contain a Google Play service-account JSON key.

`google-services.json` is the Firebase Android app config. It is not the same as a Google Play service account key and it does not contain `client_email`.

For `eas submit`, create/download a JSON key from Google Cloud IAM for your submit service account. That JSON should contain a field like:

```json
"client_email": "your-service-account@your-project.iam.gserviceaccount.com"
```

Do not commit that service-account JSON to GitHub or package it inside the app.
