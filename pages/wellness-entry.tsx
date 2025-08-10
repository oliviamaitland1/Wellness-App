import WellnessEntryForm from './WellnessEntryForm';
import withAuth from '../components/ProtectedRoute';

function WellnessEntryPage() {
  return (
    <div className="container mx-auto p-4">
      <WellnessEntryForm />
    </div>
  );
}

export default withAuth(WellnessEntryPage);
