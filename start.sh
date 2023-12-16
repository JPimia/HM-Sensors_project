#!/bin/bash

docker build -t HM_Insighthub .
docker run -p 3000:80 -d HM_Insighthub