'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Share2,
  Copy,
  Link as LinkIcon,
  QrCode,
  Check,
  Twitter,
  Facebook,
  Mail,
  Download
} from 'lucide-react';

interface SessionSharingProps {
  sessionId: string;
  palette: any;
  creativePath: string;
  result?: any;
}

export function SessionSharing({ sessionId, palette, creativePath, result }: SessionSharingProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/session/${sessionId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'email') => {
    const text = `Check out my creative ${creativePath} project made with AI!`;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const downloadSession = () => {
    const sessionData = {
      sessionId,
      palette,
      creativePath,
      result,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative-session-${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-2 border-green-200 dark:border-green-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Share Your Creation</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Share this creative session with others
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-green-500 text-green-600">
            Session: {sessionId.slice(0, 8)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Share Link */}
        <div>
          <label className="text-sm font-medium mb-2 block">Share Link</label>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1 font-mono text-sm"
            />
            <Button
              variant={copied ? 'default' : 'outline'}
              onClick={copyToClipboard}
              className={copied ? 'bg-green-600' : ''}
            >
              {copied ? (
                <><Check className="h-4 w-4 mr-2" /> Copied!</>
              ) : (
                <><Copy className="h-4 w-4 mr-2" /> Copy</>
              )}
            </Button>
          </div>
        </div>

        {/* Social Sharing */}
        <div>
          <label className="text-sm font-medium mb-3 block">Share on Social Media</label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => shareToSocial('twitter')}
              className="justify-start"
            >
              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => shareToSocial('facebook')}
              className="justify-start"
            >
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => shareToSocial('email')}
              className="justify-start"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>

        {/* QR Code & Download */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setShowQR(!showQR)}
            className="justify-start"
          >
            <QrCode className="h-4 w-4 mr-2" />
            {showQR ? 'Hide' : 'Show'} QR Code
          </Button>
          <Button
            variant="outline"
            onClick={downloadSession}
            className="justify-start"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Data
          </Button>
        </div>

        {/* QR Code Display */}
        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center"
          >
            <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center mb-3">
              <QrCode className="h-24 w-24 text-slate-400" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan to view this session
            </p>
          </motion.div>
        )}

        {/* Session Info */}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-2">
            <LinkIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Session Link Active
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Anyone with this link can view your palette and creative path. Results are only visible if you choose to share them.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
