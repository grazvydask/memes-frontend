// Import React, react-dom & dom-to-image-more
import * as React from 'react'
import { render } from 'react-dom'
import domtoimage from 'dom-to-image-more'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import components
import Content from './components/content'
import Form from './components/form'
import Result from './components/result'

// Import styles
import './styles/styles.css'

// App component
function App() {
  // Create refs
  let contentContainerRef = React.useRef<HTMLElement | null>(null)
  let resultContainerRef = React.useRef<HTMLElement | null>(null)

  const [image,setImage] = React.useState({url:''})
  const [activeImage, setActiveImage] = React.useState('')
  const [textTop, setTextTop] = React.useState('')
  const [textBottom, setTextBottom] = React.useState('')
  const [isMemeGenerated, setIsMemeGenerated] = React.useState(false)


  async function fetchImage() {
  
    setImage(await axios.get('https://memes-backend.herokuapp.com/')
      .then((response) => {
        const returnedData = response.data;
        return returnedData.image;
      }, (error) => {
        console.log(error);
      }));
      setActiveImage(image.url)

  }

  // Handle input elements
  function handleInputChange(event) {
    if (event.target.name === 'text-top') {
      // Update textTop state
      setTextTop(event.target.value)
    } else {
      // Update textBottom state
      setTextBottom(event.target.value)
    }
  }

  // Choose random images from images fetched from api.imgflip.com
  function handleImageChange() {
    // Choose random image
    //const image = images[Math.floor(Math.random() * images.length)]

    // Update activeImage state
    fetchImage();
  }

  // Handle image upload via file input
  function handleImageInputChange(event) {
    // Update activeImage state
    setActiveImage(window.URL.createObjectURL(event.target.files[0]))
  }

  // Handle meme generation
  function handleMemeGeneration() {
    // Remove any existing images
    if (resultContainerRef.current.childNodes.length > 0) {
      resultContainerRef.current.removeChild(resultContainerRef.current.childNodes[0])
    }

    // Generate meme image from the content of 'content' div
    domtoimage.toPng(contentContainerRef.current).then((dataUrl) => {
      // Create new image
      const img = new Image()

      // Use url of the generated image as src
      img.src = dataUrl

      resultContainerRef.current.appendChild(img)

      // Update state for isMemeGenerated
      setIsMemeGenerated(true)
    })
  }

  // Handle resetting the meme generator/removing existing pictures
  function handleMemeReset() {
    // Remove existing child node inside result container (generated meme image)
    resultContainerRef.current.removeChild(resultContainerRef.current.childNodes[0])

    // Update state for isMemeGenerated
    setIsMemeGenerated(false)
  }

  // Fetch images from https://api.imgflip.com/get_memes when app mounts
  React.useEffect(() => {
    // Call fetchImage method
    fetchImage()
  }, [])

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center">
      {/* Add Form component */}
      <Form
        textTop={textTop}
        textBottom={textBottom}
        handleImageInputChange={handleImageInputChange}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleMemeGeneration={handleMemeGeneration}
        handleMemeReset={handleMemeReset}
        isMemeGenerated={isMemeGenerated}
      />

      {/* Add Content component */}
      <Content
        activeImage={activeImage}
        contentContainerRef={contentContainerRef}
        textBottom={textBottom}
        textTop={textTop}
      />

      {/* Add Result component */}
      <Result resultContainerRef={resultContainerRef} />
    </div>
  )
}

// Render the App in the DOM
const rootElement = document.getElementById('root')
render(<App />, rootElement)
