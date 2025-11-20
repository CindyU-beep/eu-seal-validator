# Henkel Regulatory Compliance Image Validation System

An AI-powered automated system to validate product label images against EU (CLP/GHS) regulatory compliance standards using GPT-4o vision model for seal detection and verification.

**Experience Qualities**:
1. **Precision-Focused** - The system prioritizes accuracy and reliability, providing clear, actionable validation results that compliance officers can trust.
2. **Efficient** - Streamlined workflow from upload to validation result minimizes time spent on manual compliance checks.
3. **Professional** - Enterprise-grade interface that conveys authority and trustworthiness appropriate for regulatory work.

**Complexity Level**: Light Application (multiple features with basic state)
  - Single-purpose validation tool with image upload, comparison logic, and result display. Requires state management for images, validation results, and regulatory seal reference library.

## Essential Features

### Image Upload & Preview
- **Functionality**: Accept product label images via drag-and-drop or file selection
- **Purpose**: Provides the primary input for compliance validation
- **Trigger**: User clicks upload area or drags image file
- **Progression**: User selects/drops image → Image preview displays → Upload confirmation → Ready for validation
- **Success criteria**: Image successfully loaded, preview visible, file metadata captured

### AI-Powered Seal Validation
- **Functionality**: Use GPT-4o vision model to compare uploaded label against 15 stored EU regulatory seals
- **Purpose**: Automates compliance checking, reducing manual review time and human error
- **Trigger**: User clicks "Validate" button after uploading image
- **Progression**: Validation initiated → Loading state with progress indicator → AI analyzes image against reference seals → Results displayed with confidence scores and identified seals
- **Success criteria**: GPT-4o correctly identifies present seals, provides confidence scores, flags missing or incorrect seals

### Regulatory Seal Reference Library
- **Functionality**: Store and display the 15 EU regulatory seal reference images
- **Purpose**: Provides the ground truth dataset for validation comparisons
- **Trigger**: User navigates to "Reference Seals" view or section
- **Progression**: User clicks reference view → Gallery of 15 seals displays with labels → User can view details
- **Success criteria**: All 15 reference seals visible, properly labeled with regulation identifiers

### Validation Results Display
- **Functionality**: Present detailed compliance results with visual indicators
- **Purpose**: Communicates validation outcome clearly for decision-making
- **Trigger**: Validation process completes
- **Progression**: AI completes analysis → Results panel appears → Shows detected seals, confidence scores, compliance status → User can download report or validate another image
- **Success criteria**: Clear pass/fail indication, detailed breakdown of detected vs. required seals, actionable recommendations

### Validation History
- **Functionality**: Persist previous validation sessions for reference
- **Purpose**: Enables tracking and auditing of compliance checks over time
- **Trigger**: Automatic after each validation
- **Progression**: Validation completes → Result stored with timestamp → Available in history view → User can review past validations
- **Success criteria**: Historical validations persist between sessions, searchable/filterable by date or result

## Edge Case Handling
- **No seals detected**: Display clear message indicating no regulatory seals found, suggest image quality check
- **Low confidence scores**: Flag results with confidence below 80% as "Needs Manual Review"
- **Invalid image format**: Validate file type on upload, show error for unsupported formats
- **Oversized images**: Resize/compress large images automatically while preserving detail
- **Network failures during validation**: Show retry option with clear error messaging
- **Empty reference library**: Graceful handling if regulatory seals not yet loaded

## Design Direction
The interface should evoke trust, precision, and corporate professionalism—reflecting Henkel's enterprise standards. Design should feel authoritative and serious, with a clean minimal interface that keeps focus on the validation task. The aesthetic should lean toward technical precision rather than playful, using clear visual hierarchy to guide compliance officers through the validation workflow.

## Color Selection
Complementary color scheme emphasizing trust (blues) and validation states (green for pass, amber for warning, red for fail)

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.15 250)) - Communicates trust, authority, and corporate professionalism
- **Secondary Colors**: 
  - Neutral Gray (oklch(0.95 0 0)) - For backgrounds and subtle UI elements
  - Cool Slate (oklch(0.65 0.02 240)) - For secondary actions and informational content
- **Accent Color**: Validation Green (oklch(0.65 0.18 145)) - For success states, approved validations, and positive CTAs
- **Foreground/Background Pairings**:
  - Background (White #FFFFFF): Dark Gray text (oklch(0.25 0 0)) - Ratio 13.1:1 ✓
  - Card (Light Gray oklch(0.98 0 0)): Dark text (oklch(0.25 0 0)) - Ratio 12.8:1 ✓
  - Primary (Blue oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 7.2:1 ✓
  - Secondary (Gray oklch(0.95 0 0)): Dark text (oklch(0.3 0 0)) - Ratio 10.5:1 ✓
  - Accent (Green oklch(0.65 0.18 145)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Destructive (Red oklch(0.55 0.22 25)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓

## Font Selection
Typography should convey technical precision and corporate professionalism, using clean sans-serif fonts optimized for readability of technical information and validation results.

**Primary Font**: Inter - for its excellent readability and modern professional appearance
**Secondary Font**: JetBrains Mono - for displaying technical details, file names, and validation metadata

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight tracking (-0.02em)
  - H2 (Section Headers): Inter Semibold/24px/tight tracking (-0.01em)
  - H3 (Card Titles): Inter Semibold/18px/normal tracking
  - Body (Primary Content): Inter Regular/16px/relaxed line-height (1.6)
  - Caption (Metadata): Inter Regular/14px/normal line-height (1.5)
  - Technical (File info): JetBrains Mono Regular/13px/normal line-height (1.4)

## Animations
Subtle and purposeful animations that reinforce validation states and guide attention to results without feeling frivolous—appropriate for serious regulatory work.

- **Purposeful Meaning**: Animations communicate system processing (validation in progress), state transitions (pass/fail results appearing), and guide attention to critical compliance information
- **Hierarchy of Movement**: 
  - High priority: Validation result appearance, compliance status indicators
  - Medium priority: Image upload transitions, panel expansions
  - Low priority: Hover states, subtle micro-interactions

## Component Selection

- **Components**:
  - **Card**: Primary container for upload area, validation results, and reference seal gallery
  - **Button**: All CTAs (Upload, Validate, Download Report) with variant states for primary/secondary actions
  - **Badge**: Compliance status indicators (Pass/Fail/Warning), confidence score labels
  - **Progress**: Validation progress indicator during AI processing
  - **Alert**: Warnings for low confidence scores or missing seals
  - **Tabs**: Switch between "Validate", "Reference Seals", and "History" views
  - **Dialog**: Display enlarged reference seal images, detailed validation reports
  - **Scroll Area**: For validation history list and reference seal gallery
  - **Separator**: Visual division between validation sections

- **Customizations**:
  - Custom image upload dropzone with drag-and-drop visual feedback
  - Custom validation result cards with seal comparison visualizations
  - Custom confidence score visualization (progress bars or radial indicators)
  - Status indicator component for pass/fail/warning states with appropriate colors

- **States**:
  - Buttons: Distinct hover (subtle shadow), active (pressed appearance), disabled (during validation), loading (spinner for validation process)
  - Upload zone: Default, drag-over (highlighted border), filled (image preview), error (red border)
  - Validation results: Loading skeleton, success (green accent), warning (amber accent), failure (red accent)

- **Icon Selection**:
  - Upload: UploadSimple (Phosphor)
  - Validation: ShieldCheck, CheckCircle, WarningCircle, XCircle
  - History: ClockCounterClockwise
  - Reference: Books or Certificate
  - Download: DownloadSimple
  - Image: Image or FileImage

- **Spacing**:
  - Page margins: px-8 py-6
  - Card padding: p-6
  - Section gaps: gap-6 for primary sections, gap-4 for related items
  - Button padding: px-6 py-3 for primary, px-4 py-2 for secondary

- **Mobile**:
  - Stack validation results vertically on mobile
  - Single column layout for reference seal gallery (grid-cols-2 on mobile, grid-cols-5 on desktop)
  - Collapsible history list with expandable detail views
  - Bottom-fixed validation button on mobile for easy access
  - Touch-optimized dropzone with larger tap targets
