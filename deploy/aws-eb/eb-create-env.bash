#!/usr/bin/env bash

##
# getopt source from::
# http://stackoverflow.com/questions/2721946/cross-platform-getopt-for-a-shell-script

PROG=`basename $0`

usage() {
  echo "Usage: $PROG -n app-name -a app-version -c cname-prefix -e env-name -k key-pair -i iam-role -s security-groups" >&2
}

getopt -T > /dev/null
if [ $? -eq 4 ]; then
  # GNU enhanced getopt is available
  ARGS=`getopt --name "$PROG" --long app-name:,app-version:,env-name:,env-type:,key-pair:,iam-role:,security-groups:,cname-prefix:,profile: --options n:a:e:t:k:i:s:c:p: -- "$@"`
else
  # Original getopt is available (no long option names, no whitespace, no sorting)
  ARGS=`getopt n:a:e:t:k:i:s:c:p: "$@"`
fi
if [ $? -ne 0 ]; then
  usage
  exit 2
fi
eval set -- $ARGS

while [ $# -gt 0 ]; do
    case "$1" in
        -n | --app-name)    APP_NAME="$2"; shift;;
        -a | --app-version) APP_VERSION="$2"; shift;;
        -e | --env-name)  ENV_NAME="$2"; shift;;
        -t | --env-type)  ENV_TYPE="$2"; shift;;
        -k | --key-pair)  KEY_PAIR="$2"; shift;;
        -i | --iam-role)  IAM_ROLE="$2"; shift;;
        -s | --security-groups)  SECURITY_GROUPS="$2"; shift;;
        -c | --cname-prefix)  CNAME_PREFIX="$2"; shift;;
        -p | --profile)  AWS_PROFILE="$2"; shift;;
        --)              shift; break;; # end of options
    esac
    shift
done

# Remaining parameters can be processed
#  for ARG in "$@"; do
#    echo "$PROG: argument: $ARG"
#  done

if [ -z "$APP_NAME" ] || [ -z "$APP_VERSION" ] || [ -z "$ENV_NAME" ] || [ -z "$KEY_PAIR" ] || [ -z "$IAM_ROLE" ] || [ -z "$SECURITY_GROUPS" ]; then
    usage
    exit 2
fi

OPTIONAL_ARGS=""

if [ -n "$CNAME_PREFIX" ]; then
    OPTIONAL_ARGS="${OPTIONAL_ARGS} --cname-prefix=${CNAME_PREFIX}"
fi

if [ -n "$AWS_PROFILE" ]; then
    OPTIONAL_ARGS="${OPTIONAL_ARGS} --profile=${AWS_PROFILE}"
fi

OPTION_SETTINGS=
if [ "x$ENV_TYPE" = "xSingleInstance" ]; then
OPTION_SETTINGS=$( cat << EndOfDoc
  {
    "Namespace":"aws:elasticbeanstalk:environment",
    "OptionName":"EnvironmentType",
    "Value":"${ENV_TYPE}"
  }
EndOfDoc
)
else
OPTION_SETTINGS=$( cat << EndOfDoc
  {
    "Namespace":"aws:autoscaling:asg",
    "OptionName":"MinSize",
    "Value":2
  },
  {
    "Namespace":"aws:autoscaling:asg",
    "OptionName":"MaxSize",
    "Value":4
  },
  {
    "Namespace":"aws:elb:policies",
    "OptionName":"ConnectionDrainingEnabled",
    "Value":"true"
  },
  {
    "Namespace":"aws:autoscaling:updatepolicy:rollingupdate",
    "OptionName":"RollingUpdateEnabled",
    "Value":"true"
  },
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
EndOfDoc
)
fi

if [ -n "$SECRET_KEY_BASE" ]; then
OPTION_SETTINGS=$( cat << EndOfDoc
  ${OPTION_SETTINGS},
  {
    "Namespace":"aws:elasticbeanstalk:application:environment",
    "OptionName":"SECRET_KEY_BASE",
    "Value":"${SECRET_KEY_BASE}"
  }
EndOfDoc
)
fi

if [ -n "$DB_HOST" ]; then
OPTION_SETTINGS=$( cat << EndOfDoc
  ${OPTION_SETTINGS},
  {
    "Namespace":"aws:elasticbeanstalk:application:environment",
    "OptionName":"DB_HOST",
    "Value":"${DB_HOST}"
  }
EndOfDoc
)
fi

if [ -n "$DB_PORT" ]; then
OPTION_SETTINGS=$( cat << EndOfDoc
  ${OPTION_SETTINGS},
  {
    "Namespace":"aws:elasticbeanstalk:application:environment",
    "OptionName":"DB_PORT",
    "Value":"${DB_PORT}"
  }
EndOfDoc
)
fi

if [ -n "$DB_USER" ]; then
OPTION_SETTINGS=$( cat << EndOfDoc
  ${OPTION_SETTINGS},
  {
    "Namespace":"aws:elasticbeanstalk:application:environment",
    "OptionName":"DB_USER",
    "Value":"${DB_USER}"
  }
EndOfDoc
)
fi

if [ -n "$DB_PASSWORD" ]; then
OPTION_SETTINGS=$( cat << EndOfDoc
  ${OPTION_SETTINGS},
  {
    "Namespace":"aws:elasticbeanstalk:application:environment",
    "OptionName":"DB_PASSWORD",
    "Value":"${DB_PASSWORD}"
  }
EndOfDoc
)
fi

if [ -n "$AUTH_UI_HOST" ]; then
OPTION_SETTINGS=$( cat << EndOfDoc
  ${OPTION_SETTINGS},
  {
    "Namespace":"aws:elasticbeanstalk:application:environment",
    "OptionName":"HOST",
    "Value":"${AUTH_UI_HOST}"
  }
EndOfDoc
)
fi

OPTION_SETTINGS=$( cat << EndOfDoc
[
  ${OPTION_SETTINGS},
  {
    "Namespace":"aws:autoscaling:launchconfiguration",
    "OptionName":"InstanceType",
    "Value":"t2.micro"
  },
  {
    "Namespace":"aws:autoscaling:launchconfiguration",
    "OptionName":"EC2KeyName",
    "Value":"${KEY_PAIR}"
  },
  {
    "Namespace":"aws:autoscaling:launchconfiguration",
    "OptionName":"IamInstanceProfile",
    "Value":"${IAM_ROLE}"
  },
  {
    "Namespace":"aws:autoscaling:launchconfiguration",
    "OptionName":"SecurityGroups",
    "Value":"${SECURITY_GROUPS}"
  },
  {
    "Namespace":"aws:elasticbeanstalk:hostmanager",
    "OptionName":"LogPublicationControl",
    "Value":"true"
  }
]
EndOfDoc
)

aws elasticbeanstalk create-environment \
	--application-name ${APP_NAME} \
	--version-label ${APP_VERSION} \
	--environment-name ${ENV_NAME} \
        --solution-stack-name "64bit Amazon Linux 2015.09 v2.0.8 running Multi-container Docker 1.9.1 (Generic)" \
	--option-settings "$OPTION_SETTINGS" \
	$OPTIONAL_ARGS

