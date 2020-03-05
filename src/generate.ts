
import * as yargs from "yargs";
import { generate } from "./generator";


const argv = yargs
	.options({
		file: {
			alias: "f",
			demandOption: true,
			default: "out.json",
			describe: "Output file"
		},
		count: {
			alias: "c",
			demandOption: true,
			default: 100,
			describe: "Count",
			type: "number"
		}
	})
	.help().argv;

export const run = async () => {
	try {
		await generate(argv);
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

