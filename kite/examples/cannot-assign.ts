class Base {
	private __type!: string;
	protected readonly __number!: number;
	protected readonly __name!: string;
	private __cache: any;
	constructor(name: string, desc: any) {
		this.__type = "Example";
		this.__number = 1;
		this.__name = name;
		Object.assign(this, desc);
	}
}

class Password extends Base {
	public readonly length!: number;
	public readonly number!: boolean | undefined;

	constructor(
		name: string,
		desc: { length: number; number?: boolean | undefined },
	) {
		super(name, desc);
	}
}

const firstPassword = new Password("first", { length: 8 });
console.log(firstPassword);
