import React, { Component } from 'react'
import Head from './HtmlHead'
import Nav from './Nav'
import { Container, Content, Title } from './Layout'

class DocsLayout extends Component {
  state = {
    isSideFolded: true,
    isMobileNavFolded: true,
  }

  static defaultProps = {
    title: '',
    description: '',
  }

  onSideToggle = () => {
    this.setState({
      isSideFolded: !this.state.isSideFolded,
      isMobileNavFolded: true,
    })
  }

  onMobileNavToggle = () => {
    this.setState({
      isMobileNavFolded: !this.state.isMobileNavFolded,
      isSideFolded: true,
    })
  }

  onRouteChange = () => {
    this.setState({ isSideFolded: true, isMobileNavFolded: true })
  }

  render() {
    const {
      children,
      title,
      description,
      useDocsSidebarMenu = true,
      pages,
    } = this.props
    const { isSideFolded, isMobileNavFolded } = this.state

    return (
      <Container>
        <Head
          title={`yafl${title ? `: ${title}` : ''}`}
          description={description}
        />

        <Nav
          useDocsSidebarMenu={useDocsSidebarMenu}
          isSideFolded={isSideFolded}
          isMobileNavFolded={isMobileNavFolded}
          pages={pages}
          onSideToggle={this.onSideToggle}
          onMobileNavToggle={this.onMobileNavToggle}
          onRouteChange={this.onRouteChange}
        />

        <Content moveRight={!isSideFolded} data-e2e-id="content">
          <Title>{title}</Title>

          {children}
        </Content>
      </Container>
    )
  }
}

export default DocsLayout

//<meta name="robots" content="noodp" />