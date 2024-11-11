#!/usr/bin/env bash
#cd /opt/webgenai
#PYTHONPATH=$PWD python database/manager.py -K
#cd -
#gunicorn --log-level=info -b 0.0.0.0:${APILOGICPROJECT_PORT} --timeout 60 -w1 -t1 --reload alsr:flask_app
export APILOGICSERVER_CHATGPT_APIKEY=NA
export APILOGICPROJECT_PORT=${APILOGICPROJECT_PORT:-5656}
export APILOGICPROJECT_SWAGGER_PORT=${APILOGICPROJECT_SWAGGER_PORT:-8282}
export APILOGICPROJECT_API_PREFIX="${APILOGICPROJECT_API_PREFIX}"


function run_project_without_rules(){
    echo RESTARTING PROJECT WITHOUT RULES
    FLASK_DEBUG=1 APILOGICPROJECT_DISABLE_RULES=1 python api_logic_server_run.py
}

FLASK_DEBUG=1 python api_logic_server_run.py 2>&1 | while read line
do
    echo "${line}" | grep -qE "Logic Bank Activation Error:"
    if [[ $? -eq 0 ]]; then
        run_project_without_rules
    fi
    echo "${line}" >&2
done
