import Notify from 'simple-notify';
import 'simple-notify/dist/simple-notify.min.css';
export const pushNotify = ({ title, status = 'success' }) => {
  new Notify({
    status,
    title,
    text: '',
    effect: 'slide',
    speed: 300,
    customClass: 'textNotify',
    customIcon: null,
    showIcon: true,
    showCloseButton: false,
    autoclose: true,
    autotimeout: 1000,
    gap: 20,
    distance: 20,
    type: 2,
    position: 'bottom right',
    customWrapper: ''
  });
};
