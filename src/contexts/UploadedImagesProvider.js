import React, { useState } from 'react'
// import merge from 'lodash.merge'
import UploadedImages from './UploadedImages'

const UploadedImagesProvider = ({ children }) => {
  /**
   * User details state / controls
   */
  const setUploadedImages = ({
    images
  }) => {
    updateUploaded(prevState => {
      console.log(prevState)
      let newImage = {
        images: uploaded.images.concat(images)
      }
      return {
        ...prevState,
        ...newImage
      }
    })
  }

  const imagesState = {
    images:[],
    setUploadedImages
  }

  const [uploaded, updateUploaded] = useState(imagesState)

  return (
    <UploadedImages.Provider value={uploaded}>
      {children}
    </UploadedImages.Provider>
  )
}

export default UploadedImagesProvider
