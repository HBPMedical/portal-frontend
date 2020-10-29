import * as React from 'react';

const code = (formId?: string): string => `
window.addEventListener("load", function(){
    var script = document.createElement('script');
    script.src = "https://support.humanbrainproject.eu/assets/form/form.js";
    script.id = "zammad_form_script";
    document.body.appendChild(script);
    script.addEventListener("load", function() {
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

    });
});
`;

const HelpDeskForm = ({
  formId = 'feedback-form'
}: {
  formId?: string;
}): JSX.Element => {
  React.useEffect(() => {
    if (!document.querySelector('#jquery')) {
      const jquery = document.createElement('script');
      jquery.setAttribute('id', 'jquery');
      jquery.src =
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js';
      document.head.appendChild(jquery);
    }

    const zammadScriptId = `zammad-${formId}`;
    if (!document.querySelector(zammadScriptId)) {
      const script = document.createElement('script');
      script.setAttribute('id', zammadScriptId);
      script.text = code(formId);
      document.head.appendChild(script);
    }
  });

  return (
    <div>
      <div id={`${formId}`} />
    </div>
  );
};

export default React.memo(HelpDeskForm);
