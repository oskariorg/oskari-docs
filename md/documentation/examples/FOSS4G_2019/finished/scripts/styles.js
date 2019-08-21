const STYLES = {
  normal: {
      image : {
        fill: {
          color: '#ff0000'
        },
        shape: 1,
        size: 3
      },
      // for resetting the selected label
      text: null
  },
  hover: {
    featureStyle: {
        inherit: true,
        effect: 'darken'
      /*
        image: {
          fill: {
              color: '#00FF00'
          }
        }*/
    },
    // Tooltip content from feature: show name in tooltip
    content: [
        { keyProperty: 'name' }
    ]
  },
  selected: {
      image : {
        shape: 2,
        size: 5,
        color: '#ff3300',
        stroke: '#000000'
      },
      text : {
        scale : 1.3,
        fill : {
          color : 'rgba(0,0,0,1)'
        },
        stroke : {
          color : 'rgba(255,255,255,1)',
          width : 2
        },
        labelProperty: 'name',
        offsetX: 65,
        offsetY: 8
      }
    }
};
