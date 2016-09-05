
const modalStyling = {
  overlay : {
    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
    overflowX         : 'hidden',
    zIndex            :  99999
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    overflowX             : 'hidden',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    border                : '1px solid #000',
    background            : '#181819'
  }
};


module.exports = modalStyling;
