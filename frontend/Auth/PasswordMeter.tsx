import React, { useState, useEffect } from "react";
import { ProgressBar, Form } from "react-bootstrap";

const strengthLevels = [
  'Very Weak',
  'Weak',
  'Good',
  'Strong',
  'Very Strong'
];

const variantLookup = {
  'Very Weak': 'danger',
  'Weak': 'danger',
  'Good': 'warning',
  'Strong': 'success',
  'Very Strong': 'success'
}

export const PasswordMeter = (props: { password: string | undefined }) => {
  const [strength, setStrength] = useState(0);
  const verdict = strengthLevels[strength];
  const [comments, setComments] = useState<string[]>([]);
  useEffect(() => {
    if (!props.password) return;
    import('zxcvbn').then(estimateStrength => {
      const estimation = estimateStrength.default(props.password!);
      setStrength(estimation.score);
      const comments: string[] = [];
      if (estimation.feedback.warning) comments.push(estimation.feedback.warning);
      if (estimation.feedback.suggestions.length > 0) comments.push(...estimation.feedback.suggestions);
      setComments(comments);
    });
  }, [props.password]);
  return (
    <div className="form-group">
      <ProgressBar variant={variantLookup[verdict]} now={100 * strength / 4} label={props.password && verdict} />
      {comments.map(c => (
        <Form.Text key={c}>
          {c}
        </Form.Text>
      ))}
    </div>
  );
};
