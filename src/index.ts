import notifier from 'node-notifier';
import { Plugin } from 'vite';
import path from "path";
import NotificationCenter from "node-notifier/notifiers/notificationcenter";

const DEFAULT_ICON_PATH = path.resolve(__dirname, 'icons');
function ViteBuildNotifier(
    options: NotificationCenter.Notification|undefined,
    suppressOnStart:boolean = false,
    suppressSound:boolean = false,
    onStart: Function|null = null,
    onEnd: Function|null = null,
): Plugin {
  return {
    name: 'Notification Plugin',
    buildStart() {
      if(onStart) onStart();
      if(!suppressOnStart) {
        notifier.notify(options || {
          contentImage: path.join(DEFAULT_ICON_PATH, 'compile.png'),
          title: getTitle() + ' - Compiling',
          message: 'Compiling files... ',
          sound: !suppressSound
        });
      }
    },
    buildEnd(error?: Error) {
      if (error) {
        notifier.notify(options || {
          contentImage: path.join(DEFAULT_ICON_PATH, 'failure.png'),
          title: getTitle() + ' - Error',
          message: 'Build error\n'+error.message,
          sound: !suppressSound
        });
      } else {
        notifier.notify(options || {
          contentImage: path.join(DEFAULT_ICON_PATH, 'success.png'),
          title: getTitle() + ' - Success',
          message: 'Build successful!',
          sound: !suppressSound
        });
      }
      if(onEnd) onEnd(error);
    },
  };
}

/**
 * Return ucfirst title
 */
function getTitle() {
  let title = path.basename(path.resolve());
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export default ViteBuildNotifier;