import { App, Modal, Setting } from "obsidian";

export interface ModalInputField {
  label: string;
  value: string;
  type?: string | undefined;
}

export interface Values {
  [key: string]: string;
}

export class InputModal extends Modal {
  values: Values;
  title: string;
  inputs: ModalInputField[];
  submitText: string;
  onSubmit: (results: Values) => void;

  constructor(
    app: App,
    props: {
      title: string;
      inputs: ModalInputField[];
      submitText: string;
      onSubmit: (results: Values) => void;
    },
  ) {
    super(app);
    const { title, inputs, submitText, onSubmit } = props;
    this.title = title;
    this.inputs = inputs;
    this.submitText = submitText;
    this.onSubmit = onSubmit;
    this.values = {};
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: this.title });

    for (const input of this.inputs) {
      new Setting(contentEl).setName(input.label).addText((text) => {
        text.onChange((value) => {
          this.values[input.value] = value;
        });
        if (input.type) {
          text.inputEl.type = input.type;
        }
      });
    }

    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText(this.submitText)
        .setCta()
        .onClick(() => {
          this.close();
          if (Object.keys(this.values).length > 0) {
            this.onSubmit(this.values);
          }
        })
    );
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}
