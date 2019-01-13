import React from 'react'
import ScanPackItem from './ScanPackItem'
import { Loader } from 'semantic-ui-react'

/*
***Training the model***
When training the tf.model, it is good to warm up 
the model to upload weights to the GPU and compile WebGL
when data is collected from the webcam it will be quick:
async function loadTruncatedMobileNet = () => {
  const mobilenet = await tf.loadModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

  // Return a model that outputs an internal activation.
  const layer = mobilenet.getLayer('conv_pw_13_relu');
  return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}
componentDidMount(){
    this.loadTruncatedMobileNet
} 
***Training a specific class with a 'label*** 
ExampleHandler = (label) => {
  tf.tidy(() => {
    const img = webcam.capture();
    controllerDataset.addExample(truncatedMobileNet.predict(img), label);

    // Draw the preview thumbnail.
    ui.drawThumb(img, label);
  });
})
***The addExample from above:***
  addExample(example, label) {
    // One-hot encode the label.
    const y = tf.tidy(
        () => tf.oneHot(tf.tensor1d([label]).toInt(), this.numClasses));

    if (this.xs == null) {
      // For the first example that gets added, keep example and y so that the
      // ControllerDataset owns the memory of the inputs. This makes sure that
      // if addExample() is called in a tf.tidy(), these Tensors will not get
      // disposed.
      this.xs = tf.keep(example);
      this.ys = tf.keep(y);
    } else {
      const oldX = this.xs;
      this.xs = tf.keep(oldX.concat(example, 0));

      const oldY = this.ys;
      this.ys = tf.keep(oldY.concat(y, 0));

      oldX.dispose();
      oldY.dispose();
      y.dispose();
    }
  }
*/

class ScanPackItems extends React.Component{

    state = {
        items: this.props.items
    }

    componentDidMount(){
        this.structureItems()
    }

    structureItems = () => {
        const newItems =  this.props.items.reduce((accum, item, i) => {
            let newObject = new Object()
            newObject["item_name"] = item.item_name
            newObject["item_id"] = item.item_id
            newObject["isFliped"] = 'card'
            accum.push(newObject)
            return accum
        },[])
        this.setState({items: newItems})
        return newItems
    }

    test = (id) => {
        const matchedItem = this.state.items.filter((item, index) => {
            return index === id
        })[0]
        const itemIndex = this.state.items.indexOf(matchedItem)
        let newItem 
        const newState = this.state.items
        if(newState[itemIndex].isFliped === 'card'){
            newItem = {item_name: matchedItem.item_name, item_id: matchedItem.item_id, isFliped: 'card is-fliped'}
        } else {
            newItem = {item_name: matchedItem.item_name, item_id: matchedItem.item_id, isFliped: 'card'}
        }
        newState[itemIndex] = newItem
        this.setState({items: newState})
    }

    render(){
        const {items} = this.state
        if(items){
            return items.map((item, index) => {
                    return (
                        <div key={index} onClick={this.test.bind(this,index)}>
                        <ScanPackItem item={item} />
                        </div>
                    )
                })
            
        } else {
            return <Loader active />
        }
    }
}  


export default ScanPackItems