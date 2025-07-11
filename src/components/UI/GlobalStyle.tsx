import { createGlobalStyle } from 'styled-components';

import backgroundImage from '../../images/body-bg.jpg';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: url(${backgroundImage}) top center no-repeat fixed #f5f5f5;
    background-size: 100% auto;
  }

  .header h3 {
    margin: 0;
    font-size: 1.4em;
  }

  .header p {
    margin: 0;
    padding: 0;
  }

  .sidebar h4, .sidebar2 h4 {
    margin: 0.25em 0;
    font-size: 1.3em
  }

  .sidebar p,  .sidebar label {
    margin: 0;
    font-size: 0.9em
  }

   h5 {
    font-weight: bold;
    color: #666;
  }

   h6 {
    color: #333;
  }

    p, label, ol {
  }



  a {
    color: #007ad9;
    text-decoration: none;
  }

  a:hover {
    color: #0056b3;
    text-decoration: underline;
  }

  .secondary {
    color: #6c757d;
  }

  .success {
    color: #28a745;
  }

  .info {
    color: #17a2b8;
  }

  .warning {
    color: #ffc107;
  }

  .danger {
    color: #dc3545;
  }

  .btn {
    font-size: 0.9rem;
  }

  .zammad-form .btn {
    background-color: #eee;
    border-color: #ddd;
    color: #333;
  }
  
  .card {
    margin-bottom: 8px;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }

  .card-body {
    padding: 8px 4px 8px 8px;
  }

  .card section:not(:first-child) {
    margin-top: 16px;
  }

   /* Header */

  .header .card-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0px;
  }

  .header h3 {
    flex: 2;
  }

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
`;
