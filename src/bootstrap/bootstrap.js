import { env } from 'node:process'
import { run } from './ric.js'

// from: https://github.com/aws/aws-lambda-base-images/blob/nodejs14.x/Dockerfile.nodejs14.x
// ENV LANG=en_US.UTF-8
// ENV TZ=:/etc/localtime
// ENV PATH=/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/opt/bin
// ENV LD_LIBRARY_PATH=/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib:/opt/lib
// ENV LAMBDA_TASK_ROOT=/var/task
// ENV LAMBDA_RUNTIME_DIR=/var/runtime

const { LAMBDA_TASK_ROOT, _HANDLER } = env

run(LAMBDA_TASK_ROOT, _HANDLER)
