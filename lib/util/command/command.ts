class Command {
    name: string;
    description: string;
    usage: string;
    aliases: string[];
    category: string;
    constructor({ name, description, usage, aliases, category }: Partial<{ name: string, description: string, usage: string, aliases: string[], category: string }>) {
        this.name = this.name || name || "unnamed";
        this.description = description || "";
        this.usage = usage || "";
        this.aliases = aliases || [];
        this.category = category || "miscilaneous";
    }
    run(){}
}
export default Command;