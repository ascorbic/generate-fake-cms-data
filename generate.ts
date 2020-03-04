import fs from "fs-extra";
import path from "path";
import * as yargs from "yargs";
import { lorem, random } from "faker";

const generateEntry = () => {
	const title = lorem.sentence(3, 6);
	return {
		title,
		slug: lorem.slug(),
		excerpt: lorem.paragraph(),
		description: `# ${title}

${lorem.paragraph()}

${new Array(random.number(8))
	.fill(undefined)
	.map((_, i) => `${i + 1}. ${lorem.sentence()}`).join("\n")}

## ${lorem.sentence()}

${lorem.paragraph()}

> ${lorem.paragraph()}

${new Array(random.number(8))
	.fill(undefined)
	.map(() => `* ${lorem.sentence()}`).join("\n")}

${lorem.paragraph()}
`
	};
};

const generate = async ({ file, count }: { file: string; count: number }) => {
	const p = path.resolve(process.cwd(), file);

	if (await fs.pathExists(p)) {
		throw new Error(`${p} already exists`);
	}

	const fd = fs.createWriteStream(p);

	fd.write("[");

	for (let i = 1; i < count; i++) {
		fd.write(`${JSON.stringify(generateEntry())},`);
	}
	fd.write(`${JSON.stringify(generateEntry())}]`);
	fd.end();
	console.log(`Wrote ${count} dummy entries`);
};

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

const run = async () => {
	try {
		await generate(argv);
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

run();
