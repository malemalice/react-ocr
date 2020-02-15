import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Collapse, notification } from 'antd';
import UploadedImages from '../contexts/UploadedImages'
import Boundingbox from 'react-bounding-box'

const { Panel } = Collapse;

const Results = () =>{
  const { images, setUploadedImages } = useContext(UploadedImages)

  const callback = (key) => {
    console.log(key);
  }

  const testParam = [
    [116, 10, 69, 11],
  ]

  const onClicked = (index) =>{
    if(index>0)
    console.log(index)
    console.log(images)
    console.log(images && images[0].ocrResults.texts[index])
    popDetail(images[0].ocrResults.texts[index])
  }

  const popDetail = (text) => {
    notification.open({
      message: 'Detail Text',
      description: text,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  return (
    <Fragment>
      <Collapse defaultActiveKey={['1']} onChange={callback}>
        {images && images.map((item,index)=>(
          <Panel header={item.createdAt.toString()} key={index}>
            <Boundingbox
                image={item.base64}
                boxes={item.ocrResults.boundings}
                onClicked={onClicked}
                options={{
        base64Image: true,
        colors: {
          normal: 'rgba(255,225,255,1)',
          selected: 'rgba(0,225,204,1)',
          unselected: 'rgba(100,100,100,1)'
        },
        style: {
          maxWidth: '100%',
          maxHeight: '90vh'
        }
        //showLabels: false
      }}
              />
          </Panel>
        ))}
        </Collapse>
    </Fragment>
  )
}
export default Results
