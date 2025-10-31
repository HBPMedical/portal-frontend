import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #020550;
    background-size: 100% auto;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: 'Open Sans Condensed', sans-serif;
    font-weight: bold;
  }

  h1 {
    font-size: 2em;
    color: #fff;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.25em;
  }

  h4 {
    font-size: 1.125em;
  }

  h5 {
    font-size: 1em;
  }

  h6 {
    font-size: 0.8em;
  }

  .header p {
    margin: 0;
    padding: 0;
  }

  // .sidebar h4, .sidebar2 h4 {
  //   margin: 0.25em 0;
  //   font-size: 1.3em
  // }

  .sidebar p,  .sidebar label {
    margin: 0;
    font-size: 0.9em
  }

   h5 {
    font-weight: bold;
    color: #2b33e9;
  }

   h6 {
    color: #333;
  }

    p, label, ol {
  }



  a {
    color: #2b33e9;
    text-decoration: none;
  }

  a:hover {
    color: #2b33e9;
    text-decoration: underline;
  }

  .primary {
    color: #2b33e9;
    background-color: #2b33e9;
  }

  // .btn-secondary {
  //   background-color: #DBDBDB;
  //   border-color: #2b33e9;
  //   color: #2b33e9;
  // }

  .badge-secondary {
    background-color: #2b33e9;
    color: #fff;
  }

  .btn-primary {
    background-color: #2b33e9;
    border-color: #2b33e9;
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
  }

  .child.variable {
    background-color: #ffba08;
    border-color: #ffba08;
    color: #fff;
  }

  .child.covariate {
    background-color: #bba66f;
    border-color: #bba66f;
    color: #fff;
  }

  .child.filter {
    background-color: #483300; //bba66f
    border-color: #483300;
    color: #fff;
  }

  .btn {
    font-size: 0.9rem;
    border-radius: 6px;
  }

  .zammad-form .btn {
    background-color: #eee;
    border-color: #ddd;
    color: #333;
  }
  
  .card {
    margin-bottom: 8px;
    background-color: #fff;
    // border: 1px solid #2b33e9;
    border-radius: 10px;
    // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }

  .card-body {
    padding: 8px 8px 8px 8px;
  }

  .card section:not(:first-child) {
    margin-top: 16px;
  }

  .list-group-flush {
    border-radius: 6px;
  }

   /* Header */

   .header .card {
   border: none;
   }

   .header .header-title {
    display: flex;
    align-items: center;
    gap: 20px;
   }

  .header .experiment-header-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0px;
    background-color: #020550;
    border: none;
    padding: 16px;
  }

  .header .btn-primary {
    font-size: 1.1rem;
  }

  // .header h3 {
  //   flex: 2;
  // }

  .header button+h3 {
    margin-left: 8px;
  }

  .header .card-body .text {
    flex: 2;
  }

  .content {
    flex-basis: 100%;
    display: flex;
  }

  .content .sidebar,
  .content .sidebar2 {
    width: 240px;
    flex: 0 0 auto;
  }

  .content .sidebar {
    margin-right: 8px;
  }

  .content .sidebar2 {
    margin-left: 8px;
  }

  .sidebar2 .card-body {
    margin-bottom: 16px;
  }

  .content .parameters,
  .content .results {
    flex: 1 auto;
  }

  .content .results .result-list {
    display: flex;
    flex-direction: column;
    gap: 35px;
  }

  .panel {
    margin-bottom: 8px;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }

  #main-modal {
    width: 1200px; 
    margin: 50px auto;
  }

  .nav-tabs {
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 16px;
  }

  @media (min-width: 576px) {
    #main-modal.modal-dialog {
      max-width: 100vw;
      margin: 1.75rem auto;
    }
  }

  @media (max-width: 767px) {
    #main-modal {
      width: 768px; 
      margin: 50px auto;
    }

    #main-modal.modal-dialog {
      width: 768px; 
    }

    #main-modal .modal-footer {
      text-align: left;
    }
  }

  .dropdown-menu {
    margin-top: 4px;
  }

  // .visualization-dropdown > button {
  //   background-color: #fff;
  //   border: 1px solid #2b33e9;
  //   color: #2b33e9;
  // }

  // .visualization-dropdown > button:hover {
  //   background-color: #2b33e9;
  //   color: #fff;
  // }
  
  // #dropdown-basic {
  //   border: 1px solid #2b33e9;
  //   color: #2b33e9;
  //   background-color: #fff;
  // }

  // .dropdown-domain > button {
  //   border: 1px solid #2b33e9;
  //   color: white;
  //   background-color: #2b33e9;
  //   padding: 6px 12px;
  // }

  // .dropdown-domain > button:hover {
  //   background-color: #2b33e9;
  //   color: white;
  // }

  // .dropdown-domain > button:active {
  //   background-color: #2b33e9;
  //   color: white;
  // }

  // .dropdown-domain > button:not(:active):hover {
  //   background-color: #2b33e9;
  //   color: white;
  // }

  

  // .btn-info {
  //   background-color: #2b33e9;
  //   border-color: #2b33e9;
  // }

  // .btn-info:hover {
  //   background-color: #2b33e9;
  //   border-color: #2b33e9;
  // }

  // .btn-info:disabled {
  //   background-color: #2b33e9;
  //   border-color: #2b33e9;
  //   opacity: 0.5;
  // }

  .badge-info {
    background-color: #2b33e9;
    color: white;
  }
  
  // .dropdown-btn {
  //   color: #2b33e9;
  // }

  // .dropdown-item.active {
  //   background-color: #2b33e9;
  //   color: white;
  // }
  
  h3 {
    font-family: 'Open Sans Condensed';
    font-weight: bold;
  }
  
`;
