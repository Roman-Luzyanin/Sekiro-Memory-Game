const modules = import.meta.glob('./assets/fight_stances/*.png', {
	eager: true,
});

const stances = Object.values(modules).map(mod => mod.default);

export default stances;