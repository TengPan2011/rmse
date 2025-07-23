const {
	contextBridge,
	ipcRenderer,
	webUtils
} = require('electron');

// REMOVE the path_basename function. We will do this in the main process.

// Set up APIs for sandboxed environment
contextBridge.exposeInMainWorld('ipc_bridge', {
  path_for_file: (file) => webUtils.getPathForFile(file),

	load_file: async (file_path, callback) => { // Make this function async
		const result = await ipcRenderer.invoke('load_file', file_path);
		if (result) {
			const filename = await ipcRenderer.invoke('get_basename', file_path); // Ask main process for the basename
			callback(filename, result);
		}
	},

	open_file: async (callback) => { // Make this function async
		const result = await ipcRenderer.invoke('open_file');
		if (result) {
			const filename = await ipcRenderer.invoke('get_basename', result.savefile); // Ask main process for the basename
			callback(filename, result);
		}
	},

	save_file: (file_path, json_str, rm_root, callback) => {
		ipcRenderer.invoke('save_file', file_path, json_str, rm_root).then((result) => {
			callback(result);
		});
	},

	dump_json: (json_str, rm_root, callback) => {
		ipcRenderer.invoke('dump_json', json_str, rm_root).then((result) => {
			callback(result);
		});
	},

	version: () => {
		return ipcRenderer.sendSync('get_version');
	}
});

window.addEventListener('DOMContentLoaded', () => {
  // This can remain empty
});