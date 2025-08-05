import { PluginSettingTab, Setting, App } from 'obsidian';
import MyPlugin from '../main';

export interface MyPluginSettings {
    readSpeed: number
    timeFormat: string
    tocHeadingPattern: string
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
    readSpeed: 60, // default reading speed
    timeFormat: "long",
    tocHeadingPattern: "## Content:"
}


export class MyPluginSettingsTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h1", { text: "Reading speed settings" });
        new Setting(containerEl)
            .setName('Reading Speed (WPM)')
            .setDesc('Set your preferred reading speed in words per minute.')
            .addText(text => text
                .setPlaceholder('Enter your WPM')
                .setValue(this.plugin.settings.readSpeed.toString())
                .onChange(async (value) => {
                    const newSpeed = parseInt(value);
                    if (!isNaN(newSpeed) && newSpeed > 0) {
                        this.plugin.settings.readSpeed = newSpeed;
                        // update ui
                        this.plugin.updateReadingTimeInStatusBar();
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName('Status Bar Time Format')
            .setDesc('Select how reading time should be displayed.')
            .addDropdown(dropdown => dropdown
                .addOption('long', 'Long (2 minutes and 30 seconds)')
                .addOption('short', 'Short (5m 30s)')
                .addOption('compact', 'Compact (5:30)')
                .setValue(this.plugin.settings.timeFormat)
                .onChange(async (value) => {
                    this.plugin.settings.timeFormat = value;
                    // update ui
                    this.plugin.updateReadingTimeInStatusBar();
                    await this.plugin.saveSettings();
                }));


        containerEl.createEl("h1", { text: "Table of Contents settings" });
        new Setting(containerEl)
            .setName('Pattern for Table of Content heading')
            .setDesc('Set the pattern for the Table of Contents heading. Default is "## Content:"')
            .addText(text => text
                .setPlaceholder('Enter your pattern')
                .setValue(this.plugin.settings.tocHeadingPattern)
                .onChange(async (value) => {
                    this.plugin.settings.tocHeadingPattern = value;
                    await this.plugin.saveSettings();
                }));
    }
}
