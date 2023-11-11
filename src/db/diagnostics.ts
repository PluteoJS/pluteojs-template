import os = require("os");

import * as pgMonitor from "pg-monitor";
import {IInitOptions} from "pg-promise";

import logger from "@loaders/logger";
import appUtil from "@util/appUtil";

// changing the default theme.
pgMonitor.setTheme("matrix");

/**
 * Below we are logging errors exactly the way they are reported by pg-monitor,
 * which you can tweak any way you like, as parameter 'info' provides all the
 * necessary details for that.
 *
 * See: https://github.com/vitaly-t/pg-monitor#log
 */
pgMonitor.setLog((msg, info) => {
	/*
		In a PROD environment we will only receive event 'error',
		because this is how we set it up below.

		And the check below is for DEV environment only, as we want to log
		errors only, or else the file will grow out of proportion in no time.
	 */
	if (info.event === "error") {
		// line break + next error message;
		let logText = os.EOL + msg;

		if (info.time) {
			/*
				If it is a new error being reported,
				and not an additional error line.

				add another line break in front
			*/
			logText = os.EOL + logText;
		}

		logger.loggerInstance.error(logText);
	}

	/*
		We absolutely must not let the monitor write anything into the console
		while in a PROD environment, and not just because nobody will be able
		to see it there, but mainly because the console is incredibly slow and
		hugely resource-consuming, suitable only for debugging.
	 */

	if (!appUtil.isDev()) {
		/*
			If it is not a DEV environment:
			display nothing;

			The no-param-reassign rule has been disabled for the next line as this is
			a special case to set the configuration for pg-monitor.
		 */
		// eslint-disable-next-line no-param-reassign
		info.display = false; //
	}
});

export class Diagnostics {
	/**
	 * Monitor initialization function.
	 *
	 * @param options
	 */
	static init<Ext = {}>(options: IInitOptions<Ext>): void {
		if (appUtil.isDev()) {
			// In a DEV environment, we attach to all supported events:
			pgMonitor.attach(options);
		} else {
			/*
				In a PROD environment we should only attach to the type of events
				that we intend to log. And we are only logging event 'error' here:
			*/
			pgMonitor.attach(options, ["error"]);
		}
	}
}
