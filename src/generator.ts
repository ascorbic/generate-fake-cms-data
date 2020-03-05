import fs from "fs-extra";
import path from "path";
import { lorem, random } from "faker";

export const generateEntry = () => {
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

export const generate = async ({ file, count }: { file: string; count: number }) => {
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