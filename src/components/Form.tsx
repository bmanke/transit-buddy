import { type SubmitEvent, useState } from "react";
import { sendFormData } from "../lib/formData";

export default function Form() {
    const [meetspot, setMeetspot] = useState('');
    const [meettime, setMeettime] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>();

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (meetspot === destination) {
            setMessage('Meet up spot and destination can not be the same!')
            setLoading(false);
            return;
        }
        else 
        {
            const {ok, error} = await sendFormData( meetspot, meettime, destination)
            setMessage(ok ? 'SUCCESS!' : error)
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h2>Transit Buddy setup</h2>
                <label htmlFor='meetspot'>Meet-up Spot:</label>
                <p>
                    <select 
                        id='meetspot' 
                        value={meetspot} 
                        onChange={(e) => setMeetspot(e.target.value)} 
                        required>
                        <option value='' disabled>Choose Meetup location</option>
                        <option value='A1'>Metro Line - Station A1</option>
                        <option value='A2'>Metro Line - Station A2</option>
                    </select>
                </p>
            </div>
            <div>
                <label htmlFor='meettime'>Meet-up Time:</label>
                <p>
                    <input 
                        id='meettime' 
                        type='time'
                        value={meettime} 
                        onChange={(e) => setMeettime(e.target.value)} 
                        required
                    />
                </p>
            </div>
            <div>
                <label htmlFor='destination'>Destination:</label>
                <p>
                    <select 
                        id='destination' 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)}
                        required>
                        <option value='' disabled>Choose a destination</option>
                        <option value='A1'>Metro Line - Station A1</option>
                        <option value='A2'>Metro Line - Station A2</option>
                    </select>
                </p>
            </div>

            <button type="submit" disabled={loading}>
                Confirm details
            </button>
            <p>{message}</p>
        </form>
    )

}