import { Workbench, EditorView } from 'vscode-extension-tester';

export namespace notifications {
	export const ATLASMAP_STARTING = "Starting AtlasMap instance at port ";
	export const ATLASMAP_RUNNING = "Running AtlasMap instance found";
	export const ATLASMAP_WAITING = "Waiting for ";
	export const ATLASMAP_STOPPING = "Stopping AtlasMap instance at port";
	export const ATLASMAP_STOPPED = "Stopped AtlasMap instance at port";
	export const ATLASMAP_UNABLE_LOCATE = "Unable to locate running AtlasMap instance";
}

export namespace commands {
	export const START_ATLASMAP = "AtlasMap: Open AtlasMap";
	export const STOP_ATLASMAP = "AtlasMap: Stop AtlasMap";
}

export namespace views {
	export const ATLASMAP_TITLE = "AtlasMap";
}

/**
 * Contains all specific methods, constants, etc. for extension - AtlasMap
 * @author jkopriva
 */
class AtlasMapExt {

	public async start() {
		await new Workbench().executeCommand(commands.START_ATLASMAP);
	}

	public async stop() {
		await new Workbench().executeCommand(commands.STOP_ATLASMAP);
	}

	public async tabIsAccessible() {
		await new EditorView().openEditor(views.ATLASMAP_TITLE);
	}

	public async windowExists(): Promise<boolean | undefined> {
		try {
			const titles = await new Workbench().getEditorView().getOpenEditorTitles();
			for (const title of titles) {
				if (title.indexOf(views.ATLASMAP_TITLE) > -1) {
					return true;
				}
			}
			return false;
		} catch (err) {
			// do not print err
			return false;
		}
	}
}

export { AtlasMapExt };
export default { AtlasMapExt };
