"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: string, answer: string) => Promise<void>;
  initialQuestion: string;
  initialAnswer: string;
}

export function EditCardModal({ isOpen, onClose, onSave, initialQuestion, initialAnswer }: EditCardModalProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuestion(initialQuestion);
      setAnswer(initialAnswer);
    }
  }, [isOpen, initialQuestion, initialAnswer]);

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) return;
    setIsSaving(true);
    try {
      await onSave(question.trim(), answer.trim());
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="sm:max-w-[600px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Flashcard</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Question</label>
            <Textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="resize-none h-24 text-base font-medium"
              placeholder="e.g. What is the primary function of mitochondria?"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Answer</label>
            <Textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="h-40 text-base"
              placeholder="e.g. They generate most of the chemical energy needed to power the cell's biochemical reactions..."
              disabled={isSaving}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !question.trim() || !answer.trim()}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
