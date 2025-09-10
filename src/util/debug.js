export function logOnce (...args) {
	if (!logOnce.logged.has(args[0])) {
		logOnce.logged.add(args[0]);
		console.log(...args);
	}

	return args[0];
}

logOnce.logged = new Set();
