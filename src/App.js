import React from 'react';
import './App.css';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import Results from './components/Results';
import UploadedImagesProvider from './contexts/UploadedImagesProvider'

const { Header, Content, Footer } = Layout;


function App() {
  return (
    <UploadedImagesProvider>
      <Layout className="layout">
        <Header style={{ background: '#fff', padding: '0 275px' }}>
          <Icon className={'trigger'} type={'menu-fold'} /> OCR DEMO
        </Header>
      <Content style={{ padding: '0 300px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <FileUpload/>
          <Results/>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>React OCR Demo ©2018</Footer>
    </Layout>
  </UploadedImagesProvider>

  );
}

export default App;
