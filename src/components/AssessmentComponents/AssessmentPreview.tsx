import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAssessmentById } from '../../api/JobsApi/AssessmentApi';
import type { Assessment, Question, QuestionDetails } from '../../data/AssessmentFunctions/assessment';

const PreviewSingleChoice: React.FC<{ question: Question }> = ({ question }) => {
    if (question.details.type !== 'single-choice') return null;
    return (
        <div className="space-y-2">
            {question.details.options.map((option, index) => (
                <div key={index} className="flex items-center">
                    <input type="radio" id={`${question.id}-${index}`} name={question.id} disabled className="mr-2" />
                    <label htmlFor={`${question.id}-${index}`}>{option}</label>
                </div>
            ))}
        </div>
    );
};

const PreviewMultiChoice: React.FC<{ question: Question }> = ({ question }) => {
    if (question.details.type !== 'multi-choice') return null;
    return (
        <div className="space-y-2">
            {question.details.options.map((option, index) => (
                <div key={index} className="flex items-center">
                    <input type="checkbox" id={`${question.id}-${index}`} disabled className="mr-2" />
                    <label htmlFor={`${question.id}-${index}`}>{option}</label>
                </div>
            ))}
        </div>
    );
};

const PreviewQuestion: React.FC<{ question: Question }> = ({ question }) => {
    const renderQuestionDetails = (details: QuestionDetails) => {
        switch (details.type) {
            case 'single-choice': return <PreviewSingleChoice question={question} />;
            case 'multi-choice': return <PreviewMultiChoice question={question} />;
            case 'short-text': return <input type="text" disabled className="w-full p-2 border rounded-md bg-gray-100" />;
            case 'long-text': return <textarea disabled className="w-full p-2 border rounded-md bg-gray-100" rows={4} />;
            case 'numeric': return <input type="number" disabled className="w-full p-2 border rounded-md bg-gray-100" />;
            case 'file-upload': return <input type="file" disabled className="w-full p-2 border rounded-md bg-gray-100" />;
            default: return null;
        }
    };

    return (
        <div className="mb-4">
            <label className="block font-semibold mb-2">
                {question.text}
                {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderQuestionDetails(question.details)}
        </div>
    );
};

interface AssessmentPreviewProps {
    assessment?: Assessment | null;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ assessment: assessmentFromProp }) => {
    const { jobId, assessmentId } = useParams<{ jobId: string; assessmentId: string }>();
    const [internalAssessment, setInternalAssessment] = useState<Assessment | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (assessmentFromProp === undefined && assessmentId) {
            const loadAssessment = async () => {
                setIsLoading(true);
                try {
                    // Fetch the specific assessment using its ID
                    const assessment = await fetchAssessmentById(parseInt(assessmentId, 10));
                    setInternalAssessment(assessment);
                } catch (error) {
                    console.error("Failed to load assessment for preview:", error);
                    setInternalAssessment(null);
                } finally {
                    setIsLoading(false);
                }
            };
            loadAssessment();
        } else {
            setIsLoading(false);
        }
    }, [assessmentId, assessmentFromProp]);

    const assessment = assessmentFromProp !== undefined ? assessmentFromProp : internalAssessment;
    const isStandalonePage = assessmentFromProp === undefined;

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading Assessment Preview...</div>;
    }

    if (!assessment) {
        if (isStandalonePage) {
            return (
                <div className="p-8 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Assessment Not Found</h2>
                    <p className="text-gray-600 mb-6">This assessment could not be found.</p>
                    <Link to={`/jobs/${jobId}/assessment-builder`} className="text-blue-500 hover:underline">&larr; Back to Assessments List</Link>
                </div>
            );
        }
        return <div className="p-6 bg-gray-50 rounded-lg">No assessment data to preview.</div>;
    }

    const previewBody = (
        <>
            <h2 className="text-2xl font-bold mb-4">{assessment.title}</h2>
            {assessment.sections.map(section => (
                <div key={section.id} className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">{section.title}</h3>
                    {section.questions.map(question => (
                        <PreviewQuestion key={question.id} question={question} />
                    ))}
                </div>
            ))}
        </>
    );

    if (isStandalonePage) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Link to={`/jobs/${jobId}/assessment-builder`} className="text-blue-500 hover:underline">&larr; Back to Assessments List</Link>
                    </div>
                    <div className="p-8 bg-white rounded-lg border shadow-md">
                        {previewBody}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-6 bg-gray-50 rounded-lg border">
            {previewBody}
        </div>
    );
};

export default AssessmentPreview;
