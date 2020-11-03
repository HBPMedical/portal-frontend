import * as React from 'react';

const code = (formId?: string): string => `
  try {
    $(function () {
      $('#${formId}').ZammadForm({
        messageTitle: 'Feedback Form',
        messageSubmit: 'Submit',
        messageThankYou: 'Thank you for your inquiry (#%s)! We will contact you as soon as possible.'
      });
    });
    setTimeout(function() {
      var preselects = document.querySelectorAll('[name="hbp-category"] option[value="Medical Informatics"]');
      preselects.forEach(preselect => {
        preselect.selected = "selected"
      });
    }, 200);
  } catch(e) {
    window.addEventListener("load", function(){
      $(function () {
        $('#${formId}').ZammadForm({
          messageTitle: 'Feedback Form',
          messageSubmit: 'Submit',
          messageThankYou: 'Thank you for your inquiry (#%s)! We will contact you as soon as possible.'
        });
      });
      setTimeout(function() {
        var preselects = document.querySelectorAll('[name="hbp-category"] option[value="Medical Informatics"]');
        preselects.forEach(preselect => {
          preselect.selected = "selected"
        });
      }, 200);
    })
  }`;

const HelpDeskForm = ({
  formId = 'feedback-form'
}: {
  formId?: string;
}): JSX.Element => {
  React.useEffect(() => {
    // Load jQuery once
    if (!document.querySelector('#jquery')) {
      const script = document.createElement('script');
      script.setAttribute('id', 'jquery');
      script.async = true;
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js';
      document.head.appendChild(script);
    }

    // Load ZammadScript once
    if (!document.querySelector('#zammad_form_script')) {
      const script = document.createElement('script');
      script.setAttribute('id', 'zammad_form_script');
      script.async = true;
      script.src = 'https://support.humanbrainproject.eu/assets/form/form.js';
      document.head.appendChild(script);
    }

    // Load the form via jQuery and code as code.text = '...', 
    // first time with window.onload to ensure jQuery is loaded
    const scriptId = `${formId}-loader`;
    const scriptElement = document.querySelector(`#${scriptId}`);
    if (scriptElement) {
      document.body.removeChild(scriptElement);
    }
    const script = document.createElement('script');
    script.setAttribute('id', scriptId);
    script.text = code(formId);
    document.body.appendChild(script);
  });

  return (
    <div>
      <div id={`${formId}`} style={{ minHeight: '400px' }} />
    </div>
  );
};

export default React.memo(HelpDeskForm);
