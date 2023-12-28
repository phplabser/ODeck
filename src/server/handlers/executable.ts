import path from 'path';
import { HandlerConfig, KeyPressEvent } from 'interfaces';
import os from 'os';
import exec from 'child_process';
import Handler from './common/handler';
import KeyTypes from '../enums/keys.enum';

const isMac = os.platform() === 'darwin';

export const config: HandlerConfig = {
  groupKey: 'system',
  defaultActive: true,
  id: 'executable',
  handlers: {
    [KeyTypes.EXECUTABLE]: {
      title: 'executable.title',
      icon: 'MdLink',
      description: 'executable.description',
      defaults: {
        label: 'executable.label',
        backgroundColor: 'transparent',
        color: '#fff',
      },
    },
  },
  config: [],
  inputs: {
    [KeyTypes.EXECUTABLE]: [
      {
        label: 'executable.input.label_1',
        description: 'executable.input.description_1',
        type: 'file',
        name: 'exePath',
        defaultValue: '',
        props: {
          types: [
            { name: 'Executables', extensions: [isMac ? '.app' : '.exe'] },
          ],
        },
      },
    ],
  },
};

export default class ExecutableHandler extends Handler {
  initialize() {
    this.bindHandler(KeyTypes.EXECUTABLE, this.onKeyPress);
  }

  onKeyPress({ keyPressed }: KeyPressEvent) {
    if (!keyPressed.actionConfig.exePath) return;
    const cwd = path.dirname(keyPressed.actionConfig.exePath);
    if (!isMac) {
      exec.execFile(keyPressed.actionConfig.exePath, undefined, { cwd });
    } else {
      exec.exec(`/usr/bin/open "${keyPressed.actionConfig.exePath}"`);
    }
  }
}
