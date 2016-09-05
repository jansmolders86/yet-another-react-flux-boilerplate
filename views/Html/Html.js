import React, { Component, PropTypes } from 'react';

class Html extends Component {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    css: PropTypes.string,
    body: PropTypes.string.isRequired,
    entry: PropTypes.string.isRequired
  };

  static defaultProps = {
    title: 'Top 10 lists',
    description: 'Top 10 lists'
  };

  render() {
    return (
      <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <title>{ (this.props.title || 'Top 10 lists') }</title>
        <meta
          name="description"
          content={ (this.props.description || 'Top 10 lists')}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="apple-touch-icon" sizes="57x57" href="/images/apple-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/images/apple-icon-60x60.png"/>
        <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="76x76" href="/images/apple-icon-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="/images/apple-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/images/apple-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon-180x180.png"/>
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800' rel='stylesheet' type='text/css'/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/public.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.3.15/slick.css" />
        <style type="text/css" dangerouslySetInnerHTML={{ __html: this.props.css }}/>
      </head>
      <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: this.props.body }}/>
      <script src={this.props.entry}></script>
      </body>
      </html>
    );
  }

}

export default Html;
