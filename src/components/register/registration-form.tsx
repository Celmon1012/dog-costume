"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
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
  const router = useRouter();
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
      breed: "",
      costumeDescription: "",
      inspiration: "",
      funnyFact: "",
    },
  });

  async function onSubmit(values: DogRegistrationInput) {
    setSubmitting(true);
    setStatus(null);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, value]) => fd.append(key, value ?? ""));
      if (photo) {
        fd.append("photo", await compressImage(photo));
      }
      const result = await registerDog(fd);
      if (result.ok && result.uniqueId) {
        const params = new URLSearchParams({
          id: result.uniqueId,
          name: values.dogName,
        });
        router.push(`/register/thanks?${params.toString()}`);
        return;
      }
      if (result.ok) {
        setStatus({
          type: "ok",
          text: result.message ?? "Registered",
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Register your dog</CardTitle>
        <CardDescription>
          Sign up once — you&apos;ll get a contestant ID like DOG-001
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
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Golden retriever mix" {...field} />
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
                  <FormLabel>What are they dressed as?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Batman cape and mask..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inspiration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costume inspiration (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="We saw this in a movie / family tradition..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="funnyFact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funny fact or personality (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Steals socks, afraid of broccoli..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Dog photo (optional)</FormLabel>
              <p className="text-sm text-slate-500">
                This will help showcase your dog for voting and remind everyone
                of their awesome costume.
              </p>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-orange-200 bg-orange-50/50 px-4 py-8 text-center hover:bg-orange-50">
                <Upload className="mb-2 h-8 w-8 text-orange-600" />
                <span className="text-sm text-slate-600">
                  {photo
                    ? photo.name
                    : "Tap to upload — skip if you prefer"}
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
            <Button type="submit" className="w-full" loading={submitting}>
              {submitting ? "Submitting..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
