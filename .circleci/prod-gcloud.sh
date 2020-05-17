#!/bin/bash

set -e

# expecting the install directly in the home directory
cd ${HOME}
mkdir prod
GCLOUD_PROD=${HOME}/prod/google-cloud-sdk/bin/gcloud

echo ${GCLOUD_SERVICE_KEY_PROD} | base64 --decode --ignore-garbage > ${HOME}/prod/gcloud-service-key.json

if ${GCLOUD_PROD} version 2>&1 >> /dev/null; then
    echo "Cloud SDK is already installed"
else
    SDK_URL=https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-190.0.1-linux-x86_64.tar.gz
    INSTALL_DIR=${HOME}/prod

    cd ${INSTALL_DIR}
    wget ${SDK_URL} -O cloud-sdk.tar.gz
    tar -xzvf cloud-sdk.tar.gz

    ${GCLOUD_PROD} components install app-engine-java
fi

${GCLOUD_PROD} auth activate-service-account --key-file ${HOME}/prod/gcloud-service-key.json
${GCLOUD_PROD} config set project ${GCLOUD_PROJECT_PROD}
