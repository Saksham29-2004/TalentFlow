import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fetchAssessmentsForJob, saveAssessmentResponse } from '../../api/JobsApi/AssessmentApi';
import type { Assessment, Question } from '../../data/AssessmentFunctions/assessment';

const AssessmentRuntime: React.FC = () => {
  const { jobId, candidateId } = useParams<{ jobId: string, candidateId: string }>();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const numericJobId = jobId ? parseInt(jobId, 10) : 0;
  const numericCandidateId = candidateId ? parseInt(candidateId, 10) : 0;

  useEffect(() => {
    const loadAssessments = async () => {
      if (numericJobId) {
        setIsLoading(true);
        try {
            const fetchedAssessments = await fetchAssessmentsForJob(numericJobId);
            setAssessments(fetchedAssessments);
            if (fetchedAssessments.length === 1) {
                setSelectedAssessment(fetchedAssessments[0]);
            }
        } catch (error) {
            console.error("Failed to load assessments:", error);
        } finally {
            setIsLoading(false);
        }
      }
    };
    loadAssessments();
  }, [jobId]);

  const onSubmit = async (data: any) => {
    if (numericJobId && numericCandidateId) {
      try {
        await saveAssessmentResponse({
          jobId: numericJobId,
          candidateId: numericCandidateId,
          responses: data,
        });
        alert('Assessment submitted successfully!');
        
      } catch (error) {
          console.error("Failed to submit assessment:", error);
          alert('Error: Could not submit assessment.');
      }
    }
  };

  const renderQuestion = (question: Question) => {
    // Conditional logic to show/hide a question based on another answer
    if (question.condition) {
      const watchedValue = watch(question.condition.questionId);
      if (String(watchedValue) !== String(question.condition.value)) {
        return null; // Don't render this question if the condition isn't met
      }
    }
    
    const rules: any = {};
    if (question.isRequired) {
        rules.required = 'This field is required';
    }
    
    const renderInput = () => {
        switch (question.details.type) {
            case 'short-text':
                return <input type="text" {...register(question.id, rules)} className="w-full p-2 border rounded-md" />;
            case 'long-text':
                return <textarea {...register(question.id, rules)} className="w-full p-2 border rounded-md" rows={4} />;
            case 'numeric':
                return <input type="number" {...register(question.id, rules)} className="w-full p-2 border rounded-md" />;
            case 'single-choice':
                return (
                    <div className="space-y-2">
                        {question.details.options.map((opt, i) => (
                            <div key={i} className="flex items-center">
                                <input {...register(question.id, rules)} type="radio" value={opt} id={`${question.id}-${i}`} className="h-4 w-4"/>
                                <label htmlFor={`${question.id}-${i}`} className="ml-2">{opt}</label>
                            </div>
                        ))}
                    </div>
                );
            case 'multi-choice':
                return (
                    <div className="space-y-2">
                        {question.details.options.map((opt, i) => (
                            <div key={i} className="flex items-center">
                                <input {...register(question.id, rules)} type="checkbox" value={opt} id={`${question.id}-${i}`} className="h-4 w-4"/>
                                <label htmlFor={`${question.id}-${i}`} className="ml-2">{opt}</label>
                            </div>
                        ))}
                    </div>
                );
            case 'file-upload':
                return <input type="file" {...register(question.id, rules)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>;
            default:
                return null;
        }
    };

    return (
      <div key={question.id} className="mb-6">
        <label className="block font-semibold mb-2">
          {question.text}
          {question.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        {renderInput()}
        {errors[question.id] && <p className="text-red-500 text-sm mt-1">{errors[question.id]?.message as string}</p>}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Assessment...</div>;
  }

  if (selectedAssessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-w-3xl w-full bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-2">{selectedAssessment.title}</h1>
            <p className="text-gray-600 mb-8">Please answer all questions to the best of your ability.</p>
            {selectedAssessment.sections.map(section => (
            <div key={section.id} className="mb-6">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">{section.title}</h2>
                {section.questions.map(renderQuestion)}
            </div>
            ))}
            <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Submit Assessment
            </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Select an Assessment</h1>
      {assessments.length > 0 ? (
        <div className="space-y-4">
          {assessments.map(assessment => (
            <button
              key={assessment.id}
              onClick={() => setSelectedAssessment(assessment)}
              className="w-full p-4 bg-white border rounded-lg shadow-sm hover:shadow-md text-lg font-semibold text-gray-800 transition-shadow"
            >
              {assessment.title}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No assessments are available for this job.</p>
      )}
    </div>
  );
};

export default AssessmentRuntime;
