"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { compressImage } from "@/lib/compress-image";
import { registerDog } from "@/actions/dogs";
import {
  dogRegistrationSchema,
  type DogRegistrationInput,
} from "@/lib/validations/dog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RegistrationForm() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<DogRegistrationInput>({
    resolver: zodResolver(dogRegistrationSchema),
    defaultValues: {
      dogName: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      costumeDescription: "",
    },
  });

  async function onSubmit(values: DogRegistrationInput) {
    if (!photo) {
      setStatus({ type: "err", text: "Please upload a dog photo." });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      const compressed = await compressImage(photo);
      const fd = new FormData();
      Object.entries(values).forEach(([key, value]) => fd.append(key, value));
      fd.append("photo", compressed);
      const result = await registerDog(fd);
      if (result.ok) {
        setStatus({
          type: "ok",
          text: result.message ?? `Registered as ${result.uniqueId}`,
        });
        form.reset();
        setPhoto(null);
      } else {
        setStatus({ type: "err", text: result.error });
      }
    } catch {
      setStatus({
        type: "err",
        text: "Registration failed. Try a smaller photo (under 5MB) and submit again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Register your dog</CardTitle>
        <CardDescription>
          Sign up on event day — you&apos;ll get a contestant ID like DOG-001
          automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dogName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dog name</FormLabel>
                  <FormControl>
                    <Input placeholder="Max" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alex Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="ownerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="555-0100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="costumeDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costume description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Batman cape and mask..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Dog photo</FormLabel>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-orange-200 bg-orange-50/50 px-4 py-8 text-center hover:bg-orange-50">
                <Upload className="mb-2 h-8 w-8 text-orange-600" />
                <span className="text-sm text-slate-600">
                  {photo
                    ? photo.name
                    : "Tap to upload — phone photos are compressed automatically"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            {status ? (
              <p
                className={
                  status.type === "ok"
                    ? "text-sm font-medium text-emerald-700"
                    : "text-sm font-medium text-red-600"
                }
              >
                {status.text}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
