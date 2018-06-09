until node main.js; do
	echo "Bot exited with the code $?. Respawning" >&2
	sleep 1
done
