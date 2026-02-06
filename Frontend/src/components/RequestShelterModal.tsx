import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { submitShelterRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface RequestShelterModalProps {
  open: boolean;
  onClose: () => void;
  shelter: any;
  isOpen: boolean;
}

const RequestShelterModal = ({
  open,
  onClose,
  shelter,
  isOpen,
}: RequestShelterModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bedsNeeded, setBedsNeeded] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { toast } = useToast();

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      await submitShelterRequest(shelter.id, {
        name,
        phone,
        email,
        gender,
        age,
        beds_needed: bedsNeeded,
        notes,
      });

      setSubmitted(true);

      // Delay closing to show success message
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        // Reset form
        setName('');
        setPhone('');
        setEmail('');
        setGender('');
        setAge('');
        setBedsNeeded(1);
        setNotes('');
      }, 2000);

    } catch (error) {
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Failed to submit request",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <h2 className="text-xl font-bold mb-1">
              Request Shelter
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              {shelter.name} • {isOpen ? 'Open' : 'Closed'}
            </p>

            {/* Shelter info */}
            <div className="bg-muted/40 rounded-xl p-3 mb-4 text-sm">
              <p><strong>Beds Available:</strong> {shelter.available_beds}</p>
              <p><strong>Address:</strong> {shelter.address}</p>
            </div>

            {/* FORM */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Age</label>
                <input
                  type="number"
                  min={0}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter age"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Beds Needed</label>
                <input
                  type="number"
                  min={1}
                  max={shelter.available_beds}
                  value={bedsNeeded}
                  onChange={(e) => setBedsNeeded(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special needs?"
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name || bedsNeeded < 1}
              className="btn-primary-large w-full"
            >
              Send Request
            </button>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center py-10">
            <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">
              Request Sent Successfully
            </h2>
            <p className="text-muted-foreground mb-6">
              The shelter has received your request.
            </p>

            <button
              onClick={onClose}
              className="btn-primary-large w-full"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestShelterModal;
