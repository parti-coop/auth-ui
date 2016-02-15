#!/usr/bin/env bash

script_dir() {
    local source="${BASH_SOURCE[0]}"
    while [ -h "$source" ] ; do # resolve $SOURCE until the file is no longer a symlink
        local dir="$( cd -P "$( dirname "$source" )" && pwd )"
        source="$( readlink "$source" )";
        # if $source was a relative symlink
        # we need to resolve it relative to the path where the symlink file was located
        [[ $source != /* ]] && source="$dir/$source"
    done
    printf "$( cd -P "$( dirname "$source" )" && pwd )"
}

SCRIPT_DIR=$( script_dir )
APP_HOME=$( dirname $( dirname $SCRIPT_DIR ) )

if [ -z "$APP_VERSION" ]; then
    echo "APP_VERSION does not exist."
    exit 1
fi

if [ -z "$APP_NAME" ]; then
    echo "APP_NAME does not exist."
    exit 1
fi

if [ -z "$APP_ENV_NAME" ]; then
    echo "APP_ENV_NAME does not exist."
    exit 1
fi

if [ -z "$APP_S3BUCKET" ]; then
    echo "APP_S3BUCKET does not exist."
    exit 1
fi

${SCRIPT_DIR}/eb-create-app-version.bash \
	--app-name ${APP_NAME} \
	--app-version ${APP_VERSION} \
	--s3bucket ${APP_S3BUCKET}

aws elasticbeanstalk update-environment \
	--environment-name ${APP_ENV_NAME} \
	--version-label ${APP_VERSION} \
	--option-settings '[
	  {
	    "Namespace":"aws:elasticbeanstalk:command",
	    "OptionName":"BatchSize",
	    "Value":"1"
	  },
	  {
	    "Namespace":"aws:elasticbeanstalk:command",
	    "OptionName":"BatchSizeType",
	    "Value":"Fixed"
	  }
	]'

