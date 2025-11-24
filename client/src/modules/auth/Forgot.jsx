import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Forgot() {
  return (
   
      <div className="min-h-[80vh] grid place-items-center px-4">
        <Card className="w-full max-w-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <p className="text-sm text-slate-600">We'll email you a reset link.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Email" />
            <Button className="w-full">Send reset link</Button>
          </CardContent>
        </Card>
      </div>
    
  );
}
