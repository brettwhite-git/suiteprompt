# Learning Content Images

This directory contains visual assets for the learning center modules.

## Directory Structure

```
learning/
├── diagrams/          # Technical diagrams and flowcharts
├── illustrations/     # Conceptual illustrations
├── screenshots/       # NetSuite UI screenshots
└── icons/             # Small icons and symbols
```

## Using AI-Generated Images

### Recommended AI Tools

1. **DALL-E 3** (via ChatGPT Plus)
   - Best for: Conceptual illustrations, abstract concepts
   - Style: Professional, clean, modern

2. **Midjourney**
   - Best for: High-quality technical diagrams
   - Style: Polished, detailed

3. **Stable Diffusion**
   - Best for: Custom technical graphics
   - Style: Flexible, customizable

### Image Guidelines

#### Diagrams (`/diagrams/`)
- **Format**: SVG (preferred) or PNG
- **Size**: 1200x800px minimum
- **Style**: Clean, minimal, professional
- **Colors**: Use theme-compatible colors (see below)
- **Examples**:
  - Architecture diagrams
  - Data flow charts
  - Process workflows
  - System relationships

**Prompts for AI**:
```
"Professional technical diagram showing [topic], clean minimal style,
light background, blue and purple accent colors, isometric view,
software architecture illustration"
```

#### Illustrations (`/illustrations/`)
- **Format**: PNG or WebP
- **Size**: 800x600px minimum
- **Style**: Friendly, approachable, modern
- **Examples**:
  - Concept explanations
  - Metaphors and analogies
  - User journey illustrations
  - Abstract representations

**Prompts for AI**:
```
"Modern flat illustration of [concept], friendly and approachable style,
minimal color palette with blues and purples, clean design,
tech-forward aesthetic"
```

#### Screenshots (`/screenshots/`)
- **Format**: PNG
- **Size**: Original resolution (annotate with arrows/highlights)
- **Guidelines**:
  - Blur sensitive data
  - Add numbered callouts
  - Use consistent annotation style
  - Include context (show navigation)

**Tools**:
- **Cleanshot X** (Mac): Professional screenshot tool
- **Snagit**: Cross-platform with annotation
- **Markup** (Mac): Built-in annotation tool

#### Icons (`/icons/`)
- **Format**: SVG (preferred)
- **Size**: 24x24, 48x48, 96x96
- **Style**: Line icons or filled
- **Examples**:
  - Feature icons
  - Status indicators
  - Navigation icons

**Resources**:
- **Heroicons**: Free MIT-licensed icons
- **Lucide**: Already installed in project
- **Custom**: Generate with AI

## Theme Colors

Use these colors for consistency with the Next.js theme:

### Light Mode
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Accent: `#06b6d4` (Cyan)
- Background: `#ffffff`
- Text: `#0f172a`

### Dark Mode
- Primary: `#818cf8` (Light Indigo)
- Secondary: `#a78bfa` (Light Purple)
- Accent: `#22d3ee` (Light Cyan)
- Background: `#0f172a`
- Text: `#f1f5f9`

## File Naming Convention

Use descriptive, lowercase names with hyphens:

```
architecture-overview.svg
data-flow-animation.png
suitescript-lifecycle.svg
customer-creation-screenshot.png
module-icon-architecture.svg
```

## Optimization

### Before Adding Images

1. **Optimize file size**:
   ```bash
   # For PNG
   pngquant image.png --quality=65-80 --output optimized.png

   # For SVG
   svgo image.svg
   ```

2. **Use WebP for photos**:
   ```bash
   cwebp image.png -q 80 -o image.webp
   ```

3. **Lazy loading**: Images are automatically lazy-loaded by Next.js Image component

## Using Images in MDX

### Static Images

```mdx
import Image from 'next/image';

<Image
  src="/images/learning/diagrams/architecture-overview.svg"
  alt="NetSuite Architecture Overview"
  width={1200}
  height={800}
  className="rounded-lg border border-border"
/>
```

### Responsive Images

```mdx
<div className="relative w-full h-[400px]">
  <Image
    src="/images/learning/illustrations/concept-intro.png"
    alt="Concept Introduction"
    fill
    className="object-contain"
  />
</div>
```

### With Caption

```mdx
<figure className="my-8">
  <Image
    src="/images/learning/diagrams/data-flow.svg"
    alt="Data Flow Diagram"
    width={1000}
    height={600}
  />
  <figcaption className="text-center text-sm text-muted-foreground mt-2">
    Figure 1: Data flow through NetSuite layers
  </figcaption>
</figure>
```

## AI Prompt Templates

### For Architecture Diagrams

```
Create a professional isometric technical diagram showing [system/concept].
Style: Clean, minimal, modern software architecture illustration
Colors: Navy blue (#0f172a), indigo (#6366f1), purple (#8b5cf6)
Background: Light gray or white
View: 3D isometric with subtle shadows
Include: [specific elements]
Format: High resolution, suitable for web
```

### For Conceptual Illustrations

```
Create a modern flat illustration representing [concept/idea].
Style: Friendly, approachable, tech-forward
Colors: Blues (#6366f1), purples (#8b5cf6), with white space
Mood: Professional yet welcoming
Elements: [specific metaphors or symbols]
Composition: Centered, balanced
```

### For Icon Sets

```
Design a set of [number] minimalist line icons representing [concepts].
Style: Consistent stroke width, rounded corners
Size: 48x48 pixels
Colors: Single color (#6366f1)
Theme: Tech/software development
Icons needed: [list specific icons]
```

## Content Recommendations by Module

### Functional Users Path
- Custom field creation workflow
- Deployment process illustration
- NetSuite navigation screenshots
- Workflow builder diagram

### Developers Path
- SuiteScript architecture diagram
- SDF project structure
- SPA component hierarchy
- API integration flow

### Advanced Path
- CI/CD pipeline visualization
- Performance optimization comparison
- Testing pyramid diagram
- Integration architecture

## Best Practices

1. **Consistency**: Use similar styles across related modules
2. **Accessibility**: Include descriptive alt text
3. **Performance**: Optimize all images before committing
4. **Attribution**: Credit AI tool used (in commit message)
5. **Responsive**: Provide multiple sizes when needed
6. **Theme-aware**: Consider both light and dark modes

## Example Workflow

1. **Identify need**: Module needs architecture diagram
2. **Generate prompt**: Use template above
3. **Create with AI**: DALL-E, Midjourney, or Stable Diffusion
4. **Download**: Save as high-resolution PNG or SVG
5. **Optimize**: Run through optimization tools
6. **Name properly**: `architecture-overview.svg`
7. **Place in folder**: `/diagrams/`
8. **Add to MDX**: Use Image component
9. **Test**: Check in both light and dark modes
10. **Commit**: Include descriptive commit message

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/api-reference/next/image)
- [DALL-E 3](https://openai.com/dall-e-3)
- [Midjourney](https://midjourney.com)
- [Stable Diffusion](https://stability.ai)
- [SVG Optimization](https://jakearchibald.github.io/svgomg/)
- [WebP Converter](https://developers.google.com/speed/webp)

## Need Help?

For questions about image creation or optimization, check the project documentation or create an issue.
