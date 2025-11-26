from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models.user import UserOut

class IdNote(BaseModel):
    id: str
    
class NoteText(BaseModel):
    text: str
    author: int
    weight: int
    
class Note(BaseModel):
    id: str
    owner: UserOut
    editors: Optional[List[UserOut]]
    
    title: str
    content: Optional[str] = None
    texts: Optional[List[NoteText]] = None    
    #images: Optional[List[str]] = None  
    createdAt: datetime
    uploadedAt: datetime


"""
class NoteImage(BaseModel):
    id: str
    filename: str
    originalName: Optional[str] = None
    mimeType: Optional[str] = None
    size: Optional[int] = None
    url: Optional[str] = None
    uploadedAt: datetime
    note_id: str
"""