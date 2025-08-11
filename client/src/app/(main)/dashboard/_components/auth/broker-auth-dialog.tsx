
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useState } from 'react';

export default function BrokerAuthDialog({brokerNames}: {brokerNames: string[]}) {
    const [selectedBroker, setSelectedBroker] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Here you would send the selectedBroker and password to your /api/auth endpoint
        // using fetch or another method.
        console.log('Submitting form with:', { selectedBroker, password });

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ broker: selectedBroker, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful authentication (e.g., redirect to dashboard)
                console.log('Authentication successful:', data);
                
            } else {
                // Handle authentication errors (e.g., display error message)
                console.error('Authentication failed:', data.error);
                // Display error message to the user
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            // Handle network errors or other exceptions
        }
    };

    return (
        <DialogContent>
            {/* Modify the form to use onSubmit */}
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Switch Users</DialogTitle>
                    <DialogDescription>
                        This action allows you to switch to a different users.
                    </DialogDescription>
                </DialogHeader>
                {/* ... rest of your form elements */}
                <Select name="broker" onValueChange={setSelectedBroker}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                        {brokerNames.map((name) => (
                            <SelectItem key={name} value={name}>
                                {name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* ... rest of your form */}
                <Button type="submit">Switch</Button>
            </form>
        </DialogContent>
    );
}


