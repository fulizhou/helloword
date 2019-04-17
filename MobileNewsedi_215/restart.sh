#! /bin/sh
ps -axu | grep bin/www | awk '{print $2}' |xargs kill -9
nohup npm start&
